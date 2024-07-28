from psycopg_pool import ConnectionPool
import logging
import os
import re
import sys
from flask import current_app as app

logger = logging.getLogger(__name__)
logger.setLevel(logging.DEBUG)
console_handler = logging.StreamHandler()
logger.addHandler(console_handler)

def is_docker():
    # Check for the .dockerenv file
    if os.path.exists('/.dockerenv'):
        return True

    # Check for the docker cgroup
    try:
        with open('/proc/1/cgroup', 'rt') as f:
            for line in f:
                if 'docker' in line or 'lxc' in line:
                    return True
    except Exception:
        pass

    return False

class Db:
    def __init__(self):
        self.init_pool()

    def template(self, *args):
        pathing = list((app.root_path, 'db', 'sql') + args)
        pathing[-1] = pathing[-1] + '.sql'

        template_path = os.path.join(*pathing)

        green = '\033[92m'
        no_color = '\033[0m'
        logger.info('\n')
        logger.info(f'{green}== Load SQL Template: {template_path}')

        with open(template_path, 'r') as f:
            template_content = f.read()
            return template_content

    def init_pool(self):
        connection_url = os.getenv("CONNECTION_URL")
        if not is_docker():
            connection_url = connection_url.replace('@db:', '@127.0.0.1:')
        self.pool = ConnectionPool(connection_url)

    def print_params(self, params):
        blue = '\033[94m'
        no_color = '\033[0m'
        logger.info("\n")
        logger.info(f'{blue}== SQL Params:{no_color}')
        for key, value in params.items():
            logger.info(f'{key} : {value}')

    def print_sql(self, title, sql, params={}):
        cyan = '\033[96m'
        no_color = '\033[0m'
        logger.info(f'{cyan}== SQL STATEMENT-[{title}]{no_color}')
        logger.info(sql)
        logger.info(params)

    def query_commit(self, sql, params={}, verbose=True):
        if verbose:
            self.print_sql('commit with returning', sql, params)

        pattern = r"\bRETURNING\b"
        is_returning_id = re.search(pattern, sql)

        try:
            with self.pool.connection() as conn:
                cur = conn.cursor()
                cur.execute(sql, params)
                if is_returning_id:
                    returning_id = cur.fetchone()[0]
                conn.commit()
                if is_returning_id:
                    return returning_id
        except Exception as error:
            self.print_sql_error(error)

    def query_array_json(self, sql, params={}, verbose=True):
        if verbose:
            self.print_sql('array', sql, params)

        wrapped_sql = self.query_wrap_array(sql)
        with self.pool.connection() as conn:
            with conn.cursor() as cur:
                cur.execute(wrapped_sql, params)
                json = cur.fetchone()
                return json[0]

    def query_object_json(self, sql, params={}, verbose=True):
        if verbose:
            self.print_sql('json', sql, params)
            self.print_params(params)
        wrapped_sql = self.query_wrap_object(sql)

        with self.pool.connection() as conn:
            with conn.cursor() as cur:
                cur.execute(wrapped_sql, params)
                json = cur.fetchone()
                if json == None:
                    return "{}"
                else:
                    return json[0]

    def query_value(self, sql, params={}, verbose=True):
        if verbose:
            self.print_sql('value', sql, params)
        with self.pool.connection() as conn:
            with conn.cursor() as cur:
                cur.execute(sql, params)
                json = cur.fetchone()
                return json[0]

    def query_wrap_object(self, template):
        sql = f"""
        (SELECT COALESCE(row_to_json(object_row), '{{}}'::json)
        FROM ({template}) object_row);
        """
        return sql

    def query_wrap_array(self,template):
        sql = f"""
        (SELECT COALESCE(array_to_json(array_agg(row_to_json(array_row))),'[]'::json) FROM (
        {template}
        ) array_row);
        """
        return sql

    def print_sql_error(self, error):
        # get detail about the exception
        error_type, error_obj, traceback = sys.exc_info()
        line_num = traceback.tb_lineno

        # print the connect() error
        logger.error("\n")
        logger.error(f'psycopg ERROR: {error} on line number: {line_num}')
        logger.error(f'psycopg traceback: {traceback} -- type: {error_type}')

        logger.error(f'pgerror: {error.pgerror}')
        logger.error(f'pgcode: {error.pgcode} \n')

db = Db()
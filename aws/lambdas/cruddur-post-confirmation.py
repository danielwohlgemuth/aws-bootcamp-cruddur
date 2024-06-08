import json
import psycopg2
import os

def lambda_handler(event, context):
    conn = None
    try:
        user = event['request']['userAttributes']
        print('user', user)

        params = {
            'user_display_name': user['name'],
            'user_email': user['email'],
            'user_handle': user['preferred_username'],
            'user_cognito_id': user['sub'],
        }

        sql = f"""
        INSERT INTO public.users (
            display_name,
            email,
            handle,
            cognito_user_id
        )
        VALUES (
            %(user_display_name)s,
            %(user_email)s,
            %(user_handle)s,
            %(user_cognito_id)s
        )
        """
        print('SQL Statement')
        print(sql)
        conn = psycopg2.connect(os.getenv('CONNECTION_URL'))
        cur = conn.cursor()
        cur.execute(sql, params)
        conn.commit()

    except (Exception, psycopg2.DatabaseError) as error:
        print('error', error)
    finally:
        if conn is not None:
            cur.close()
            conn.close()
            print('Database connection closed.')
    return event
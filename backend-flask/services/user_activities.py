from lib.db import db
from aws_xray_sdk.core import xray_recorder

class UserActivities:
  def run(user_handle):
    model = {
      'errors': None,
      'data': None
    }
    if user_handle == None or len(user_handle) < 1:
      model['errors'] = ['blank_user_handle']
    else:
      sql = db.template('users','show')
      results = db.query_object_json(sql,{'handle': user_handle})
      model['data'] = results
    # subsegment = xray_recorder.begin_subsegment('mock-data')
    # xray_recorder.put_annotation('now', now.isoformat()) # indexed for use with search
    # xray_recorder.put_metadata('results-size', len(model['data']), 'namespace') # not indexed
    # xray_recorder.end_subsegment()
    return model
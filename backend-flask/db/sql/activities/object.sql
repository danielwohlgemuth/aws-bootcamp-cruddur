SELECT
    activities.uuid,
    users.display_name,
    users.handle,
    users.cognito_user_id,
    activities.message,
    activities.created_at,
    activities.expires_at
FROM public.activities
INNER JOIN public.users ON users.uuid = activities.user_uuid
WHERE activities.uuid = %(uuid)s
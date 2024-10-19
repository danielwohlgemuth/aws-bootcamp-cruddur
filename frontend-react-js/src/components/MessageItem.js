import './MessageItem.css';
import { Link } from "react-router-dom";
import { format_datetime, message_time_ago } from '../lib/DateTimeFormats';

export default function MessageItem(props) {
  const backgroundImage = `url("https://assets.${process.env.REACT_APP_DOMAIN_NAME}/avatars/${props.message.cognito_user_id}.jpg")`;
  const styles = {
    backgroundImage: backgroundImage,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };
  return (
    <div className='message_item'>
      <Link className='message_avatar' style={styles} to={`/messages/@`+props.message.handle}></Link>
      <div className='message_content'>
        <div className='message_meta'>
          <div className='message_identity'>
            <div className='display_name'>{props.message.display_name}</div>
            <div className="handle">@{props.message.handle}</div>
          </div>{/* activity_identity */}
        </div>{/* message_meta */}
        <div className="message">{props.message.message}</div>
        <div className="created_at" title={format_datetime(props.message.created_at)}>
          <span className='ago'>{message_time_ago(props.message.created_at)}</span> 
        </div>{/* created_at */}
      </div>{/* message_content */}
    </div>
  );
}
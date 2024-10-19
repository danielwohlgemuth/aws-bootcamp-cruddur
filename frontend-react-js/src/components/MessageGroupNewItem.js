import './MessageGroupItem.css';
import { Link } from 'react-router-dom';

export default function MessageGroupNewItem(props) {
    const backgroundImage = `url("https://assets.${process.env.REACT_APP_DOMAIN_NAME}/avatars/${props.user.cognito_user_id}.jpg")`;
    const styles = {
      backgroundImage: backgroundImage,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    };
    return (
        <Link className='message_group_item active' to={ `/messages/new/${props.user.handle}` }>
            <div className='message_group_avatar' style={styles}></div>
            <div className='message_content'>
                <div className='message_group_identity'>
                    <div className='display_name'>{props.user.display_name}</div>
                    <div className='handle'>@{props.user.handle}</div>
                </div>
            </div>
        </Link>
    );
}
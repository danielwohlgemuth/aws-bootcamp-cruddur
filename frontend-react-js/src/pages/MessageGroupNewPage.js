import './MessageGroupPage.css';
import React from 'react';
import { useParams } from 'react-router-dom';

import DesktopNavigation from '../components/DesktopNavigation';
import MessageGroupFeed from '../components/MessageGroupFeed';
import MessageForm from '../components/MessageForm';
import { checkAuth, getAccessToken } from '../lib/CheckAuth';
import MessageFeed from '../components/MessageFeed';

export default function MessageGroupNewPage() {
    const [otherUser, setOtherUser] = React.useState([]);
    const [messageGroups, setMessageGroups] = React.useState([]);
    const [messages, setMessages] = React.useState([]);
    const [popped, setPopped] = React.useState([]);
    const [user, setUser] = React.useState(null);
    const dataFetchedRef = React.useRef(false);
    const params = useParams();

    const loadUserShortData = async () => {
        try {
            const backend_url = `${process.env.REACT_APP_BACKEND_URL}/api/users/@${params.handle}/short`
            const res = await fetch(backend_url, {
                method: "GET"
            });
            let resJson = await res.json();
            if (res.status === 200) {
                console.log('other user:', resJson);
                setOtherUser(resJson);
            } else {
                console.log('res', res);
            }
        } catch(error) {
            console.log('error loading user short data:', error);
        }
    };

    const loadMessageGroupsData = async () => {
        try {
            const backend_url = `${process.env.REACT_APP_BACKEND_URL}/api/message_groups`;
            const accessToken = await getAccessToken();
            const res = await fetch(backend_url, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                },
                method: 'GET'
            });
            let resJson = await res.json();
            if (res.status === 200) {
                setMessageGroups(resJson)
            } else {
                console.log('res', res);
            }
        } catch (error) {
            console.log('error loading group data:', error);
        }
    };

    React.useEffect(() => {
        // prevent double call
        if (dataFetchedRef.current) return;
        dataFetchedRef.current = true;

        loadMessageGroupsData();
        loadUserShortData();
        checkAuth(setUser);
    }, [])

    return (
        <article>
            <DesktopNavigation user={user} active={'home'} setPopped={setPopped} />
            <section className='message_groups'>
                <MessageGroupFeed otherUser={otherUser} message_groups={messageGroups} />
            </section>
            <div className='content messages'>
                <MessageFeed messages={messages} />
                <MessageForm setMessages={setMessages} />
            </div>
        </article>
    );
}
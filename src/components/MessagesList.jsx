import PropTypes from "prop-types";
import Message from "./Message";
import "./MessagesList.css";

//TODO: Add the friend handler
const MessagesList = ({ messages }) => (
  <section>
    <ul className="messages">
      {messages.map((msg) => (
        <li key={msg.id}>
          <Message {...msg} />
        </li>
      ))}
    </ul>
  </section>
);

export default MessagesList;

MessagesList.propTypes = {
  messages: PropTypes.array.isRequired,
};

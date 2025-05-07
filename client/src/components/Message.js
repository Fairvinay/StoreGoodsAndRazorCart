import { Alert } from "react-bootstrap";

const Message = ({ variant, children }) => {
  return (
    <Alert className="alert-setting" variant={variant}>
      {children}
    </Alert>
  );
};

Message.defaultProps = {
  variant: "info",
};

export default Message;

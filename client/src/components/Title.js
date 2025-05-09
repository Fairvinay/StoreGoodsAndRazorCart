import { Helmet } from "react-helmet";
const Title = ({ title }) => {
  return (
    <Helmet>
      <title>{title}</title>
    </Helmet>
  );
};

Title.defaultProps = {
  title: "Store Notify",
};

export default Title;

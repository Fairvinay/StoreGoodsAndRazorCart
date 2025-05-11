import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import '../styles/search-custom.css';
const SearchBox = () => {
  const [keywords, setKeywords] = useState("");
  const history = useHistory();

  const submitHandler = value => {
    if (keywords.trim()) {
      history.push(`/search/${keywords}`);
      localStorage.setItem("keywords", keywords);
    } else {
      history.push("/");
    }
  };

  return (
    <Form onClick={submitHandler} inline>
      <Form.Control
        type="text"
        name="q"
        onChange={e => {
          setKeywords(e.target.value);
        }}
        placeholder="Search Products"
        className="ml-sm-2 ml-sm-5 w-50 search-input "
      ></Form.Control>
      <Button type="submit" variant="" className="p-2 btn-custom">{/*outline-success */}
        Search
      </Button>
    </Form>
  );
};

export default SearchBox;

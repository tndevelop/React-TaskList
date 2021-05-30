import { Col, Form } from "react-bootstrap";
import { useState } from "react";
/**
 * Description contains a checkbox and the text description. Text is red if **urgent** is *true*.
 * @param props Must contain *string* **description** and *bool* **urgent**
 */
function Description(props) {
  const [checked, setChecked] = useState(props.task.completed);

  const checkItem = (checked) => {
    setChecked(checked);
    props.setDone(props.task, checked);
  }


  return (
    <Col>
      <Form.Check
        checked={checked}
        onChange={(event) => {
          checkItem(event.target.checked);
        }}
        type="checkbox"
        label={props.description}
        className={props.important ? "text-danger" : ""}
      />
    </Col>
  );
}

export { Description };

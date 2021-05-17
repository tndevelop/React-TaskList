import { Col, Form } from "react-bootstrap";
import { useState } from "react";
/**
 * Description contains a checkbox and the text description. Text is red if **urgent** is *true*.
 * @param props Must contain *string* **description** and *bool* **urgent**
 */
function Description(props) {
  const [checked, setChecked] = useState(props.done);

  return (
    <Col>
      <Form.Check
        checked={checked}
        onChange={(event) => {
          setChecked(event.target.checked);
          props.setDone(props.task, props.id, event.target.checked);
        }}
        type="checkbox"
        label={props.description}
        className={props.important ? "text-danger" : ""}
      />
    </Col>
  );
}

export { Description };

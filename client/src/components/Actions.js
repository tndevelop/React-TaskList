import { FaTrashAlt, FaPencilAlt } from "react-icons/fa";
import { Col } from "react-bootstrap";

/**
 * Section that contains modify and delete buttons
 * @param props Must contain *functions* **modify** and **remove**
 */
function Actions(props) {
  return (
    <>
      <Col sm="auto">
        <FaPencilAlt
          className="pencil"
          onClick={() => props.setTaskToModify(props.task)}
        ></FaPencilAlt>
      </Col>
      <Col sm={0.5}>
        <FaTrashAlt
          className="trash"
          onClick={() => props.removeTask(props.task)}
        ></FaTrashAlt>
      </Col>
    </>
  );
}

export { Actions };

import { Col } from "react-bootstrap";
import { BiUserCircle } from "react-icons/bi";
/**
 * Shared can contain icon to mark a shared task
 * @param props Must contain *bool* **shared**
 * @returns Empty *Col* if **shared** is *false* else return *Col* with icon
 */
function Shared(props) {
  return (
    <Col sm="2">
      {props.private ? "" : <BiUserCircle size="1.85em"></BiUserCircle>}
    </Col>
  );
}

export { Shared };

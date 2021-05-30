import { Col } from "react-bootstrap";
import dayjs from 'dayjs';

/**
 * Deadline contains a date in format "YYYY-MM-DD HH::mm"
 * @param props Must contain a *dayjs* argument **deadline**
 */
function Deadline(props) {
  return (
    <Col className="d-flex justify-content-end">
      {props.deadline ? dayjs(props.deadline).format("YYYY-MM-DD") : ""}
    </Col>
  );
}
export { Deadline };

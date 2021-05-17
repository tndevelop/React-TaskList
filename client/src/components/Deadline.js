import { Col } from "react-bootstrap";

/**
 * Deadline contains a date in format "YYYY-MM-DD HH::mm"
 * @param props Must contain a *dayjs* argument **deadline**
 */
function Deadline(props) {
  return (
    <Col className="d-flex justify-content-end">
      {props.deadline ? props.deadline.format("YYYY-MM-DD") : ""}
    </Col>
  );
}
export { Deadline };

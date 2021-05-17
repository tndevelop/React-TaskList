import { Col, Row } from "react-bootstrap";
import { FilterList } from "./MySide.js";
import MainContent from "./MainContent";

function CentralRow(props) {
  return (
    <Row>
      <Col
        sm={3}
        xs={12}
        className="vheight-100 bg-light below-nav sidebar-left-padding d-sm-block collapse"
        id="left-sidebar"
      >
        <FilterList
          selectedFilter={props.selectedFilter}
          setFilter={props.setFilter}
        />
      </Col>
      <MainContent
        showEditingForm={props.showEditingForm}
        taskId={props.taskId}
        setDone={props.setDone}
        createElement={props.createElement}
        delete={props.delete}
        taskList={props.taskList}
        selected={props.selectedFilter}
        removeTask={props.removeTask}
      />
    </Row>
  );
}

export { CentralRow };

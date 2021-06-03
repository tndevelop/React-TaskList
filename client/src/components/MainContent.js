import { Col, Container } from "react-bootstrap";
import { AiFillPlusCircle } from "react-icons/ai";
import { AddEditForm } from "./EditingForm";
import TaskList from "./TaskList";
import { useState } from "react";

function MainContent(props) {
  const [taskToModify, setTaskToModify] = useState(undefined);
  const [hideForm, setHideForm] = useState(true);

  const modifyTask = (task) => {
    setTaskToModify(task);
    setHideForm(false);
  };

  return (
    <Col as={Container} fluid="xl" className="mainContainer below-nav">
      <h1 id="selectedFilter">
        <b>Filter</b>: {props.selected}
      </h1>
      <TaskList
        setDone={props.setDone}
        taskList={props.taskList}
        selected={props.selected}
        setTaskToModify={modifyTask}
        removeTask={props.removeTask}
        markTask={props.markTask}
      ></TaskList>

      <AiFillPlusCircle
        className="plusButton"
        color="green"
        onClick={() => {
          setTaskToModify(undefined);
          setHideForm(false);
        }}
      ></AiFillPlusCircle>

      {hideForm ? (
        ""
      ) : (
        <AddEditForm
          createElement={props.createElement}
          task={taskToModify}
          hideForm={hideForm}
          setHideForm={setHideForm}
          delete={props.removeTask}
          setDirty={props.setDirty}
          deleteLocal={props.deleteLocal}
          userId = {props.userId}
        ></AddEditForm>
      )}
    </Col>
  );
}

export default MainContent;

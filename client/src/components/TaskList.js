import { Row, ListGroup } from "react-bootstrap";
import { Actions } from "./Actions.js";
import { Shared } from "./Shared";
import { Deadline } from "./Deadline";
import { Description } from "./Description";

function TaskList(props) {
  return (
    <ListGroup variant="flush">
      {props.taskList.map((t, index) => {
        return (
          <ListGroup.Item key={t.id} index={t.id} variant={t.status}>
            <Row>
              <Description
                task={t}
                setDone={props.setDone}
                id={t.id}
                done={t.done}
                important={t.important}
                description={t.description}
              />
              <Shared private={t.private}></Shared>
              <Deadline deadline={t.deadline}></Deadline>
              {
              t.status ? ""
               : <Actions
               removeTask={props.removeTask}
               setTaskToModify={props.setTaskToModify}
               task={t}
             ></Actions>
              
               }
            </Row>
          </ListGroup.Item>
        );
      })}
    </ListGroup>
  );
}

export default TaskList;

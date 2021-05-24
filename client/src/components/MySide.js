import { ListGroup } from "react-bootstrap";
import { Link } from "react-router-dom";

const filterNames = ["All", "Important", "Today", "Next7Days", "Private"];

function FilterList(props) {
  return (
    <ListGroup variant="flush">
      {filterNames.map((name, index) => (
        <Link key={index} to={name} style={{ textDecoration: "none" }}>
          <ItemSide
            name={name}
            index={index}
            key={index}
            selectedFilter={name === props.selectedFilter}
            setFilter={props.setFilter}
            setDirty={props.setDirty}
            setLoading={props.setLoading}
          />
        </Link>
      ))}
    </ListGroup>
  );
}

function ItemSide(props) {
  return props.selectedFilter ? (
    <ListGroup.Item action active>
      {props.name}
    </ListGroup.Item>
  ) : (
    <ListGroup.Item action onClick={() => {

      props.setFilter(props.name);
      props.setDirty(true);
      props.setLoading(true);

    }}>
      {props.name}
    </ListGroup.Item>
  );
}

export { FilterList, filterNames };

const TaskModal = ({ eventId, show, handleClose }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(10); // You can change the page size as needed
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (show) {
      fetchTasks(eventId, pageNumber, pageSize);
    }
  }, [show, eventId, pageNumber, pageSize]);

  const fetchTasks = async (eventId, pageNumber, pageSize) => {
    setLoading(true);
    const data = await getAllTasksOfEvent(eventId, pageNumber, pageSize);
    if (data) {
      setTasks(data.tasks); // Assuming the response has a tasks field
      setTotalPages(data.totalPages); // Assuming the response has a totalPages field
    }
    setLoading(false);
  };

  const handlePageChange = (newPageNumber) => {
    setPageNumber(newPageNumber);
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Tasks</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <Spinner animation="border" />
        ) : (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Task Name</th>
                <th>Description</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task.id}>
                  <td>{task.id}</td>
                  <td>{task.name}</td>
                  <td>{task.description}</td>
                  <td>{task.status}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
        <Pagination>
          {[...Array(totalPages)].map((_, index) => (
            <Pagination.Item
              key={index + 1}
              active={index + 1 === pageNumber}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </Pagination.Item>
          ))}
        </Pagination>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default TaskModal;

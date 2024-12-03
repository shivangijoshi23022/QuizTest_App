import React from "react";
import PageTitle from "../../../components/PageTitle";
import { message, Table } from "antd";
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";
import { getAllReports } from "../../../apicalls/reports";
import { useEffect } from "react";
import moment from "moment";

function AdminReports() {
  const [reportsData, setReportsData] = React.useState([]);
  const dispatch = useDispatch();
  const [filters, setFilters] = React.useState({
    examName: "",
    userName: "",
  });
  const [selectedReport, setSelectedReport] = React.useState(null);
  const [view, setView] = React.useState("table");

  const columns = [
    {
      title: "Exam Name",
      dataIndex: "examName",
      render: (text, record) => <>{record.exam.name}</>,
    },
    {
      title: "User Name",
      dataIndex: "userName",
      render: (text, record) => <>{record.user.name}</>,
    },
    {
      title: "Date",
      dataIndex: "date",
      render: (text, record) => (
        <>{moment(record.createdAt).format("DD-MM-YYYY hh:mm:ss")}</>
      ),
    },
    {
      title: "Total Marks",
      dataIndex: "totalQuestions",
      render: (text, record) => <>{record.exam.totalMarks}</>,
    },
    {
      title: "Passing Marks",
      dataIndex: "correctAnswers",
      render: (text, record) => <>{record.exam.passingMarks}</>,
    },
    {
      title: "Obtained Marks",
      dataIndex: "correctAnswers",
      render: (text, record) => <>{record.result.correctAnswers.length}</>,
    },
    {
      title: "Verdict",
      dataIndex: "verdict",
      render: (text, record) => <>{record.result.verdict}</>,
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (text, record) => (
        <button
        
          onClick={() => {
            setSelectedReport(record);
            setView("review");
          }}
        >
          Review 
        </button>
      ),
    },
  ];

  const getData = async (tempFilters) => {
    try {
      dispatch(ShowLoading());
      const response = await getAllReports(tempFilters);
      if (response.success) {
        setReportsData(response.data);
      } else {
        message.error(response.message);
      }
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  useEffect(() => {
    getData(filters);
  }, []);

  return (
    <div>
      <PageTitle title="Reports" />
      <div className="divider"></div>

      {view === "table" && (
        <>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Exam"
              value={filters.examName}
              onChange={(e) =>
                setFilters({ ...filters, examName: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="User"
              value={filters.userName}
              onChange={(e) =>
                setFilters({ ...filters, userName: e.target.value })
              }
            />
            <button
              className="primary-outlined-btn"
              onClick={() => {
                setFilters({
                  examName: "",
                  userName: "",
                });
                getData({
                  examName: "",
                  userName: "",
                });
              }}
            >
              Clear
            </button>
            <button
              className="primary-contained-btn"
              onClick={() => getData(filters)}
            >
              Search
            </button>
          </div>
          <Table columns={columns} dataSource={reportsData} className="mt-2" />
        </>
      )}

      {view === "review" && selectedReport && (
        <div className="flex flex-col gap-2">
          <h1>Reviewing Report for {selectedReport.user.name}</h1>
          {selectedReport.result.correctAnswers.map((question, index) => (
            <div key={index} className="bg-success p-2">
              <h1 className="text-xl">
                {index + 1}: {question.name}
              </h1>
              <h1 className="text-md">
                Submitted Answer: {question.selectedOption} -{" "}
                {question.options[question.selectedOption]}
              </h1>
              <h1 className="text-md">
                Correct Answer: {question.correctOption} -{" "}
                {question.options[question.correctOption]}
              </h1>
            </div>
          ))}
          {selectedReport.result.wrongAnswers.map((question, index) => (
            <div key={index} className="bg-error p-2">
              <h1 className="text-xl">
                {index + 1}: {question.name}
              </h1>
              <h1 className="text-md">
                Submitted Answer: {question.selectedOption} -{" "}
                {question.options[question.selectedOption]}
              </h1>
              <h1 className="text-md">
                Correct Answer: {question.correctOption} -{" "}
                {question.options[question.correctOption]}
              </h1>
            </div>
          ))}
          <div className="flex justify-center gap-2">
            <button
              className="primary-outlined-btn"
              onClick={() => {
                setView("table");
                setSelectedReport(null);
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminReports;

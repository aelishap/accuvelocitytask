import {
  ArrowDownIcon,
  ArrowUpIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import {
  CardHeader,
  Typography,
  Button,
  CardBody,
  CardFooter,
  IconButton,
  Input,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import { useState } from "react";
import { TABLE_ROWS } from "./logData"; 
import * as XLSX from 'xlsx';

const TABLE_HEAD = ["Select", "Id", "UserId", "Log Type", "Caller Function", "Log Message", "Create Date"];
const ITEMS_PER_PAGE = 5;

export function LogTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [openModal, setOpenModal] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);
  const [selectedRows, setSelectedRows] = useState({});
  const [filterText, setFilterText] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: "Id", direction: "ascending" });

  const [idFilter, setIdFilter] = useState('');
  const [userIdFilter, setUserIdFilter] = useState('');
  const [logTypeFilter, setLogTypeFilter] = useState('');
  const [callerFunctionFilter, setCallerFunctionFilter] = useState('');
  const [logMessageFilter, setLogMessageFilter] = useState('');
  const [createdDateFilter, setCreatedDateFilter] = useState('');

  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;

  const filteredItems = TABLE_ROWS.filter(log =>
    log.LogMessage.toLowerCase().includes(filterText.toLowerCase()) &&
    log.Id.toString().toLowerCase().includes(idFilter.toLowerCase()) &&
    log.UserID.toString().toLowerCase().includes(userIdFilter.toLowerCase()) &&
    log.logtype.toLowerCase().includes(logTypeFilter.toLowerCase()) &&
    log.CallerFunction.toLowerCase().includes(callerFunctionFilter.toLowerCase()) &&
    log.LogMessage.toLowerCase().includes(logMessageFilter.toLowerCase()) &&
    log.CreatedDateTime.toLowerCase().includes(createdDateFilter.toLowerCase())
  );

  const sortedItems = [...filteredItems].sort((a, b) => {
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (aValue < bValue) {
      return sortConfig.direction === "ascending" ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === "ascending" ? 1 : -1;
    }
    return 0;
  });

  const currentItems = sortedItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedItems.length / ITEMS_PER_PAGE);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  const handleLogClick = (log) => {
    setSelectedLog(log);
    setOpenModal(true);
  };

  const closeModal = () => {
    setOpenModal(false);
    setSelectedLog(null);
  };

  const handleCheckboxChange = (logId) => {
    setSelectedRows((prev) => ({
      ...prev,
      [logId]: !prev[logId],
    }));
  };

  const downloadSelected = () => {
    const selectedData = TABLE_ROWS.filter(row => selectedRows[row.Id]);

    const worksheet = XLSX.utils.json_to_sheet(selectedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Logs");
    XLSX.writeFile(workbook, "selected_logs.xlsx");
  };

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  return (
    <>
      <div className="h-full w-full mt-8 ">
        <CardHeader floated={false} shadow={false} className="rounded-none">
          <div className="mb-4 flex flex-col justify-between gap-8 md:flex-row md:items-center">
            <div>
              <Typography variant="h5" color="blue-gray">
                Admin Page
              </Typography>
            </div>
            <div className="flex w-full shrink-0 gap-2 md:w-max">
              <div className="w-full md:w-72">
                <Input
                  label="Search Log Message"
                  icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                  onChange={(e) => setFilterText(e.target.value)}
                />
              </div>
              <Button className="flex items-center gap-3" size="sm" onClick={downloadSelected}>
                <ArrowDownIcon strokeWidth={2} className="h-4 w-4" /> Download
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardBody className="overflow-x-auto px-0">
          <table className=" text-left border border-blue-gray-200 rounded-lg shadow-md">
            <thead>
              <tr>
                {TABLE_HEAD.map((head, index) => (
                  <th
                    key={index}
                    className="border-b border-blue-gray-200 bg-blue-gray-50 p-4 text-blue-gray-600 cursor-pointer"
                    onClick={() => handleSort(head === "Id" ? "Id" : head === "UserId" ? "UserID" : head === "Log Type" ? "logtype" : head === "Caller Function" ? "CallerFunction" : head === "Log Message" ? "LogMessage" : "CreatedDateTime")}
                  >
                    <div className="flex items-center">
                      <Typography variant="small" color="blue-gray" className="font-bold leading-none">
                        {head}
                      </Typography>
                      {head !== "Select" && <div className="ml-1 flex">
                        <ArrowUpIcon
                          className={`h-3 w-3 ${sortConfig.key === (head === "Id" ? "Id" : head === "UserId" ? "UserID" : head === "Log Type" ? "logtype" : head === "Caller Function" ? "CallerFunction" : head === "Log Message" ? "LogMessage" : "CreatedDateTime") && sortConfig.direction === "ascending" ? 'text-blue-600' : 'text-gray-400'}`}
                        />
                        <ArrowDownIcon
                          className={`h-3 w-3 ${sortConfig.key === (head === "Id" ? "Id" : head === "UserId" ? "UserID" : head === "Log Type" ? "logtype" : head === "Caller Function" ? "CallerFunction" : head === "Log Message" ? "LogMessage" : "CreatedDateTime") && sortConfig.direction === "descending" ? 'text-blue-600' : 'text-gray-400'}`}
                        />
                      </div>}
                    </div>
                    {head !== "Select" && (
                      <Input
                        type="text"
                        className="mt-1 h-[35px]"
                        placeholder={`Filter ${head}`}
                        onChange={(e) => {
                          const filterValue = e.target.value;
                          if (head === "Id") setIdFilter(filterValue);
                          if (head === "UserId") setUserIdFilter(filterValue);
                          if (head === "Log Type") setLogTypeFilter(filterValue);
                          if (head === "Caller Function") setCallerFunctionFilter(filterValue);
                          if (head === "Log Message") setLogMessageFilter(filterValue);
                          if (head === "Create Date") setCreatedDateFilter(filterValue);
                        }}
                      />
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentItems.map((log, index) => {
                const isLast = index === currentItems.length - 1;
                const classes = isLast ? "p-2" : "p-2 border-b border-blue-gray-200";

                return (
                  <tr key={log.Id} className="hover:bg-blue-gray-50 cursor-pointer">
                    <td className={classes}>
                      <input
                        type="checkbox"
                        checked={selectedRows[log.Id] || false}
                        onChange={() => handleCheckboxChange(log.Id)}
                      />
                    </td>
                    <td className={classes}>
                      <Typography variant="small" color="blue-gray">
                        {log.Id}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography variant="small" color="blue-gray">
                        {log.UserID}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography variant="small" color="blue-gray">
                        {log.logtype}
                      </Typography>
                    </td>
                    <td className={classes} onClick={() => handleLogClick(log)}>
                      <Typography variant="small" color="blue-gray">
                        {log.CallerFunction.length > 50
                          ? `${log.CallerFunction.slice(0, 50)}...`
                          : log.CallerFunction}
                      </Typography>
                    </td>
                    <td className={classes} onClick={() => handleLogClick(log)}>
                      <Typography variant="small" color="blue-gray">
                        {log.LogMessage.length > 50
                          ? `${log.LogMessage.slice(0, 50)}...`
                          : log.LogMessage}
                      </Typography>
                    </td>
                    <td className={classes}>
                      <Typography variant="small" color="blue-gray">
                        {log.CreatedDateTime}
                      </Typography>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardBody>
        <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-2">
          <Button variant="outlined" size="sm" onClick={handlePreviousPage} disabled={currentPage === 1}>
            Previous
          </Button>
          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, index) => (
              <IconButton
                key={index + 1}
                variant={currentPage === index + 1 ? "outlined" : "text"}
                size="sm"
                onClick={() => handlePageClick(index + 1)}
              >
                {index + 1}
              </IconButton>
            ))}
          </div>
          <Button variant="outlined" size="sm" onClick={handleNextPage} disabled={currentPage === totalPages}>
            Next
          </Button>
        </CardFooter>
      </div>

      <Dialog open={openModal} handler={closeModal}>
        <DialogHeader>Log Details</DialogHeader>
        <DialogBody>
          {selectedLog && (
            <div>
              <Typography variant="h6" color="blue-gray">
                Caller Function: {selectedLog.CallerFunction}
              </Typography>
              <Typography variant="h6" color="blue-gray" className="mt-2">
                Log Message: {selectedLog.LogMessage}
              </Typography>
              <Typography variant="small" color="blue-gray" className="mt-2">
                Created Date: {selectedLog.CreatedDateTime}
              </Typography>
            </div>
          )}
        </DialogBody>
        <DialogFooter>
          <Button variant="text" onClick={closeModal}>
            Close
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}

export default LogTable;

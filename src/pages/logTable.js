import {
  ArrowDownTrayIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import {
  Card,
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

const TABLE_HEAD = ["Id", "UserId", "Log Type", "Caller Function", "Log Message", "Create Date"];
const ITEMS_PER_PAGE = 5;

export function LogTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [openModal, setOpenModal] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);

  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentItems = TABLE_ROWS.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(TABLE_ROWS.length / ITEMS_PER_PAGE);

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

  return (
    <>
      <Card className="h-full w-full">
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
                  label="Search"
                  icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                />
              </div>
              <Button className="flex items-center gap-3" size="sm">
                <ArrowDownTrayIcon strokeWidth={2} className="h-4 w-4" /> Download
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardBody className="overflow-x-auto px-0">
          <table className="w-full min-w-max table-auto text-left border border-blue-gray-200 rounded-lg shadow-md">
            <thead>
              <tr>
                {TABLE_HEAD.map((head) => (
                  <th
                    key={head}
                    className="border-b border-blue-gray-200 bg-blue-gray-50 p-4 text-blue-gray-600"
                  >
                    <Typography variant="small" color="blue-gray" className="font-bold leading-none">
                      {head}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentItems.map((log, index) => {
                const isLast = index === currentItems.length - 1;
                const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-200";

                return (
                  <tr key={log.Id} className="hover:bg-blue-gray-50 cursor-pointer">
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
        <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
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
      </Card>

      {/* Modal for displaying full log details */}
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

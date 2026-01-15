import { useAssetsData } from "@/features/assets";
import { useState } from "react";
import {
  Box,
  Button,
  Paper,
  styled,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  TablePagination,
} from "@mui/material";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const AssetsTable = () => {
  const { data, isLoading, error, refetch } = useAssetsData();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);



  // TODO: Handle loading state

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  // TODO: Handle error state

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        Error loading equipment: {error.message}
      </Alert>
    );
  }

  // TODO: Implement handleUpdate function for PUT request
  const handleUpdate = async (id: string, asset: any) => {
    // Use updateAsset service
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page when changing rows per page
  };

  const paginatedData = data.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="assets table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Label ID</StyledTableCell>
            <StyledTableCell>Component</StyledTableCell>
            <StyledTableCell>Equipment</StyledTableCell>
            <StyledTableCell>Type</StyledTableCell>
            <StyledTableCell>Sector</StyledTableCell>
            <StyledTableCell>Location</StyledTableCell>
            <StyledTableCell>Date</StyledTableCell>
            <StyledTableCell>Lubricant</StyledTableCell>
            <StyledTableCell>Lubricant Type</StyledTableCell>
            {/* Add more columns as needed */}
            <StyledTableCell align="right">Actions</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedData.map((row) => (
            <StyledTableRow key={row.id}>
              <StyledTableCell>{row.labelId}</StyledTableCell>
              <StyledTableCell>{row.component}</StyledTableCell>
              <StyledTableCell>{row.equipment}</StyledTableCell>
              <StyledTableCell>{row.type}</StyledTableCell>
              <StyledTableCell>{row.sector}</StyledTableCell>
              <StyledTableCell>{row.location}</StyledTableCell>
              <StyledTableCell>{row.date.split('T')[0]}</StyledTableCell>
              <StyledTableCell>{row.lubricant}</StyledTableCell>
              <StyledTableCell>{row.lubricantType}</StyledTableCell>
            
              {/* Add more cells as needed */}
              <StyledTableCell align="right">
                <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
                  {/* TODO: Add button for PUT action */}
                  <Button variant="outlined" onClick={() => handleUpdate(row.id.toString(), row)}>
                    Update
                  </Button>
                  {/* Example: */}
                </Box>
              </StyledTableCell>
            </StyledTableRow>
          ))}
          {/* Example row, remove it after implementation */}
        </TableBody>
      </Table>
      <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
    </TableContainer>
  );
};

export default AssetsTable;

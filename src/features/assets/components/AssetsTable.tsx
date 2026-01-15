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
  Collapse,
  IconButton,
  Typography,
  Divider,
  Chip,
  Grid
} from "@mui/material";

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
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

  interface RowProps {
    asset: Asset;
    onUpdate: (id: number, asset: Asset) => void;
  }

  const Row = ({ asset, onUpdate }: RowProps) => {
    const [open, setOpen] = useState(false);

    return (
      <>
        {/* Main Row */}
        <StyledTableRow>
          <StyledTableCell>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </StyledTableCell>
          <StyledTableCell>{asset.labelId}</StyledTableCell>
          <StyledTableCell>{asset.component}</StyledTableCell>
          <StyledTableCell>{asset.equipment}</StyledTableCell>
          <StyledTableCell>{asset.sector}</StyledTableCell>
          <StyledTableCell>
            <Chip
              label={asset.state ? 'Active' : 'Inactive'}
              color={asset.state ? 'success' : 'default'}
              size="small"
            />
          </StyledTableCell>

          <StyledTableCell align="right">
                <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
                  <Button variant="outlined" onClick={() => onUpdate(asset)}>
                    Update
                  </Button>
                </Box>
          </StyledTableCell>
        </StyledTableRow>

        {/* Collapsible Row */}
        <TableRow>
          <StyledTableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
          <Collapse in={open} timeout="auto" unmountOnExit>
    <Box  sx={{
      maxWidth: '100%',
      overflow: 'auto' 
    }}>
      <Typography variant="h6" gutterBottom component="div">
        Equipment Details
      </Typography>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Typography variant="body2" color="text.secondary">
            Plant Tag
          </Typography>
          <Typography variant="body1">{asset.plantTag}</Typography>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Typography variant="body2" color="text.secondary">
            Tag TGD
          </Typography>
          <Typography variant="body1">{asset.tagTGD}</Typography>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Typography variant="body2" color="text.secondary">
            Tag FP
          </Typography>
          <Typography variant="body1">{asset.tagFP}</Typography>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Typography variant="body2" color="text.secondary">
            Brand
          </Typography>
          <Typography variant="body1">{asset.brand}</Typography>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Typography variant="body2" color="text.secondary">
            Model
          </Typography>
          <Typography variant="body1">{asset.model}</Typography>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Typography variant="body2" color="text.secondary">
            Type
          </Typography>
          <Typography variant="body1">{asset.type}</Typography>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Typography variant="body2" color="text.secondary">
            Function
          </Typography>
          <Typography variant="body1">{asset.function}</Typography>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Typography variant="body2" color="text.secondary">
            Criticality
          </Typography>
          <Typography variant="body1">{asset.criticality}</Typography>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Typography variant="body2" color="text.secondary">
            Routes
          </Typography>
          <Typography variant="body1">{asset.routes}</Typography>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Typography variant="body2" color="text.secondary">
            Supplies
          </Typography>
          <Typography variant="body1">{asset.supplies}</Typography>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Typography variant="body2" color="text.secondary">
            Element
          </Typography>
          <Typography variant="body1">{asset.element}</Typography>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Typography variant="body2" color="text.secondary">
            Component
          </Typography>
          <Typography variant="body1">{asset.component}</Typography>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Divider sx={{ my: 1 }} />
          <Typography variant="subtitle2" gutterBottom>
            Lubrication Information
          </Typography>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Typography variant="body2" color="text.secondary">
            Lubricant Type
          </Typography>
          <Typography variant="body1">{asset.lubricantType}</Typography>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Typography variant="body2" color="text.secondary">
            Lubricant
          </Typography>
          <Typography variant="body1">{asset.lubricant}</Typography>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Typography variant="body2" color="text.secondary">
            Capacity
          </Typography>
          <Typography variant="body1">
            {asset.capacity} {asset.measureUnit}
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Typography variant="body2" color="text.secondary">
            Oil Analysis
          </Typography>
          <Typography variant="body1">
            {asset.oilAnalysis ? 'Yes' : 'No'}
          </Typography>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Divider sx={{ my: 1 }} />
          <Typography variant="subtitle2" gutterBottom>
            Dates & Status
          </Typography>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Typography variant="body2" color="text.secondary">
            Admission Date
          </Typography>
          <Typography variant="body1">
            {new Date(asset.admissionDate).toLocaleDateString()}
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Typography variant="body2" color="text.secondary">
            Egress Date
          </Typography>
          <Typography variant="body1">
            {asset.egressDate ? new Date(asset.egressDate).toLocaleDateString() : 'N/A'}
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Typography variant="body2" color="text.secondary">
            Review
          </Typography>
          <Typography variant="body1">{asset.review}</Typography>
        </Grid>

        {asset.observations && (
          <Grid size={{ xs: 12 }}>
            <Typography variant="body2" color="text.secondary">
              Observations
            </Typography>
            <Typography variant="body1">{asset.observations}</Typography>
          </Grid>
        )}
      </Grid>
    </Box>
  </Collapse>
          </StyledTableCell>
        </TableRow>
      </>
    );
  };



const AssetsTable = () => {
  const { data, isLoading, error, refetch } = useAssetsData();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);




  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

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
    setPage(0); 
  };

  const paginatedData = data.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650, tableLayout: 'fixed' }} aria-label="assets table">
        <TableHead>
          <TableRow>
            <StyledTableCell sx={{ width: '10%' }}/> {/* For expand/collapse button */}
            <StyledTableCell sx={{ width: '8%' }}>Label ID </StyledTableCell>
            <StyledTableCell sx={{ width: '15%' }}>Component</StyledTableCell>
            <StyledTableCell sx={{ width: '35%' }}>Equipment</StyledTableCell>
            <StyledTableCell sx={{ width: '20%' }}>Sector</StyledTableCell>
            <StyledTableCell sx={{ width: '10%' }}>State</StyledTableCell>
            <StyledTableCell sx={{ width: '10%' }} align="right">Actions</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedData.map((row) => (
            <Row key={row.id} asset ={row} onUpdate={handleUpdate} />
          ))}
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

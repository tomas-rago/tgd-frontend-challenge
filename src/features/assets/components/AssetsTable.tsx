import { useAssetsData } from "@/features/assets";
import { useState, useEffect } from "react";
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
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControlLabel,
  Switch,
  Snackbar,
  InputAdornment,
} from "@mui/material";
import type { Asset } from "../types/assetTypes";

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { getErrorMessage } from "../services/assetService";

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

interface ValidationErrors {
  suggestedQuantity?: string;
  egressDate?: string;
}

interface TouchedFields {
  suggestedQuantity?: boolean;
  egressDate?: boolean;
}

interface EditDialogProps {
  open: boolean;
  asset: Asset | null;
  onClose: () => void;
  onSave: (updatedAsset: Asset) => Promise<void>;
}

const EditDialog = ({ open, asset, onClose, onSave }: EditDialogProps) => {
  const [formData, setFormData] = useState<Partial<Asset>>({});
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<TouchedFields>({});
  const [quantityValue, setQuantityValue] = useState<string>('');

  const parseQuantityNumber = (quantity: string | undefined): string => {
    if (!quantity) return '';
    const match = quantity.match(/^(\d+(\.\d+)?)/);
    return match ? match[1] : '';
  };

  const formatQuantityWithUnit = (value: string, unit: string): string => {
    if (!value || value === '') return '';
    return `${value} ${unit}`.trim();
  };

  useEffect(() => {
    if (asset) {
      setFormData({
        function: asset.function,
        location: asset.location,
        observations: asset.observations,
        oilAnalysis: asset.oilAnalysis,
        egressDate: asset.egressDate,
        criticality: asset.criticality,
        suggestedQuantity: asset.suggestedQuantity,
      });
      setQuantityValue(parseQuantityNumber(asset.suggestedQuantity));
      setErrors({});
      setTouched({});
    }
  }, [asset]);

  const handleChange = <K extends keyof Asset>(field: K, value: Asset[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleQuantityChange = (value: string) => {
    setQuantityValue(value);
    const formattedValue = formatQuantityWithUnit(value, asset?.measureUnit || '');
    setFormData((prev) => ({ ...prev, suggestedQuantity: formattedValue }));
  };

  const handleBlur = (field: keyof Asset) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateField(field);
  };

  const validateField = (field: keyof Asset): boolean => {
    if (!asset) return true;

    let fieldError: string | undefined;

    if (field === 'suggestedQuantity') {
      if (quantityValue !== undefined && quantityValue !== '') {
        const quantity = Number(quantityValue);
        if (isNaN(quantity) || quantity <= 0) {
          fieldError = 'Must be a number greater than 0';
        } else if (asset.capacity && quantity > asset.capacity) {
          fieldError = `Must be less than or equal to capacity (${asset.capacity})`;
        }
      }
    }

    if (field === 'egressDate') {
      if (formData.egressDate) {
        const egressDate = new Date(formData.egressDate);

        if (isNaN(egressDate.getTime())) {
          fieldError = 'Invalid date';
        } else {
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          const admissionDate = asset.admissionDate ? new Date(asset.admissionDate) : null;
          const isAdmissionValid = admissionDate && !isNaN(admissionDate.getTime());

          if (isAdmissionValid) {
            admissionDate.setHours(0, 0, 0, 0);
          }

          if (egressDate <= today) {
            fieldError = 'Must be a future date';
          } else if (isAdmissionValid && egressDate <= admissionDate) {
            fieldError = `Must be after admission date (${admissionDate.toLocaleDateString()})`;
          }
        }
      }
    }

    setErrors((prev) => ({ ...prev, [field]: fieldError }));
    return !fieldError;
  };

  const validateAllFields = (): boolean => {
    setTouched({
      suggestedQuantity: true,
      egressDate: true,
    });

    const suggestedQuantityValid = validateField('suggestedQuantity');
    const egressDateValid = validateField('egressDate');

    return suggestedQuantityValid && egressDateValid;
  };

  const handleSave = async () => {
    if (!asset) return;

    if (!validateAllFields()) {
      return;
    }

    setSaving(true);
    try {
      const updatedAsset = { ...asset, ...formData };
      await onSave(updatedAsset);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  if (!asset) return null;

  const today = new Date().toISOString().split('T')[0];

  const getMinDate = () => {
    const todayTime = new Date(today).getTime();
    const admissionTime = asset.admissionDate ? new Date(asset.admissionDate).getTime() : NaN;
    const baseTime = !isNaN(admissionTime) ? Math.max(todayTime, admissionTime) : todayTime;
    return new Date(baseTime + 86400000).toISOString().split('T')[0];
  };

  const minDate = getMinDate();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Edit Equipment</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 3, mt: 1, p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Typography variant="caption" color="text.secondary">
                Label ID
              </Typography>
              <Typography variant="body1" fontWeight="bold">
                {asset.labelId}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Typography variant="caption" color="text.secondary">
                Equipment
              </Typography>
              <Typography variant="body1" fontWeight="bold">
                {asset.equipment}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Typography variant="caption" color="text.secondary">
                Component
              </Typography>
              <Typography variant="body1" fontWeight="bold">
                {asset.component}
              </Typography>
            </Grid>
          </Grid>
        </Box>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Function"
              value={formData.function || ''}
              onChange={(e) => handleChange('function', e.target.value)}
              margin="normal"
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Location"
              value={formData.location || ''}
              onChange={(e) => handleChange('location', e.target.value)}
              margin="normal"
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Criticality"
              value={formData.criticality || ''}
              onChange={(e) => handleChange('criticality', e.target.value)}
              margin="normal"
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Suggested Quantity"
              type="text"
              value={quantityValue}
              onChange={(e) => {
                const numericValue = e.target.value.replace(/\D/g, ''); // Remove ALL non-digits
                handleQuantityChange(numericValue);
              }}
              onBlur={() => handleBlur('suggestedQuantity')}
              margin="normal"
              error={touched.suggestedQuantity && !!errors.suggestedQuantity}
              helperText={touched.suggestedQuantity && errors.suggestedQuantity}
              inputProps={{
                inputMode: 'numeric', // Shows numeric keyboard on mobile
                pattern: '[0-9]*'
              }}
              InputProps={{
                endAdornment: asset.measureUnit ? (
                  <InputAdornment position="end">
                    <Typography variant="body2" color="text.secondary">
                      {asset.measureUnit}
                    </Typography>
                  </InputAdornment>
                ) : null,
              }}
            />

            {asset.capacity > 0 && (
              <Typography variant="caption" color="text.secondary">
                Max capacity: {asset.capacity} {asset.measureUnit}
              </Typography>
            )}
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Egress Date"
              type="date"
              value={formData.egressDate ? formData.egressDate.split('T')[0] : ''}
              onChange={(e) => handleChange('egressDate', e.target.value ? new Date(e.target.value).toISOString() : '')}
              onBlur={() => handleBlur('egressDate')}
              margin="normal"
              InputLabelProps={{ shrink: true }}
              inputProps={{ min: minDate }}
              error={touched.egressDate && !!errors.egressDate}
              helperText={touched.egressDate && errors.egressDate}
            />
            <Typography variant="caption" color="text.secondary">
              {asset.admissionDate && !isNaN(new Date(asset.admissionDate).getTime())
                ? `Must be after: ${new Date(asset.admissionDate).toLocaleDateString()} (Admission Date)`
                : 'Must be a future date'
              }
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.oilAnalysis || false}
                  onChange={(e) => handleChange('oilAnalysis', e.target.checked)}
                />
              }
              label="Oil Analysis"
              sx={{ mt: 2 }}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Observations"
              multiline
              rows={3}
              value={formData.observations || ''}
              onChange={(e) => handleChange('observations', e.target.value)}
              margin="normal"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={saving}>
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};



interface RowProps {
  asset: Asset;
  onUpdate: (asset: Asset) => void;
}

const Row = ({ asset, onUpdate }: RowProps) => {
  const [open, setOpen] = useState(false);

  return (
    <>
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
      <TableRow>
        <StyledTableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 2, maxWidth: '100%', overflow: 'auto' }}>

              <Typography variant="h6" gutterBottom>
                Equipment Details
              </Typography>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <Typography variant="body2" color="text.secondary">Routes</Typography>
                  <Typography variant="body1">{asset.routes?.replace(/[\]["]/g, '') || 'N/A'}</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <Typography variant="body2" color="text.secondary">Supplies</Typography>
                  <Typography variant="body1">{asset.supplies?.replace(/[\]["]/g, '') || 'N/A'}</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <Typography variant="body2" color="text.secondary">Type</Typography>
                  <Typography variant="body1">{asset.type || 'N/A'}</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <Typography variant="body2" color="text.secondary">Brand</Typography>
                  <Typography variant="body1">{asset.brand || 'N/A'}</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <Typography variant="body2" color="text.secondary">Model</Typography>
                  <Typography variant="body1">{asset.model || 'N/A'}</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <Typography variant="body2" color="text.secondary">Element</Typography>
                  <Typography variant="body1">{asset.element || 'N/A'}</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <Typography variant="body2" color="text.secondary">Criticality</Typography>
                  <Typography variant="body1">{asset.criticality || 'N/A'}</Typography>
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" gutterBottom>
                Metadata
              </Typography>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Typography variant="body2" color="text.secondary">Plant Tag</Typography>
                  <Typography variant="body1">{asset.plantTag || 'N/A'}</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Typography variant="body2" color="text.secondary">Tag TGD</Typography>
                  <Typography variant="body1">{asset.tagTGD || 'N/A'}</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Typography variant="body2" color="text.secondary">Tag FP</Typography>
                  <Typography variant="body1">{asset.tagFP || 'N/A'}</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Typography variant="body2" color="text.secondary">Tag TGD Before</Typography>
                  <Typography variant="body1">{asset.tagTGDBefore || 'N/A'}</Typography>
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" gutterBottom>
                Lubrication
              </Typography>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <Typography variant="body2" color="text.secondary">Lubricant Type</Typography>
                  <Typography variant="body1">{asset.lubricantType || 'N/A'}</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <Typography variant="body2" color="text.secondary">Lubricant</Typography>
                  <Typography variant="body1">{asset.lubricant || 'N/A'}</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <Typography variant="body2" color="text.secondary">Capacity</Typography>
                  <Typography variant="body1">{asset.capacity} {asset.measureUnit}</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <Typography variant="body2" color="text.secondary">Measure Unit</Typography>
                  <Typography variant="body1">{asset.measureUnit || 'N/A'}</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <Typography variant="body2" color="text.secondary">Oil Analysis</Typography>
                  <Typography variant="body1">{asset.oilAnalysis ? 'Yes' : 'No'}</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <Typography variant="body2" color="text.secondary">Suggested Quantity</Typography>
                  <Typography variant="body1">{asset.suggestedQuantity || 'N/A'}</Typography>
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" gutterBottom>
                Date & Status
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <Typography variant="body2" color="text.secondary">Review</Typography>
                  <Typography variant="body1">{asset.review}</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <Typography variant="body2" color="text.secondary">Function</Typography>
                  <Typography variant="body1">{asset.function || 'N/A'}</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <Typography variant="body2" color="text.secondary">Location</Typography>
                  <Typography variant="body1">{asset.location || 'N/A'}</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <Typography variant="body2" color="text.secondary">Admission Date</Typography>
                  <Typography variant="body1">
                    {new Date(asset.admissionDate).toLocaleDateString()}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <Typography variant="body2" color="text.secondary">Egress Date</Typography>
                  <Typography variant="body1">
                    {asset.egressDate ? new Date(asset.egressDate).toLocaleDateString() : 'N/A'}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <Typography variant="body2" color="text.secondary">Date</Typography>
                  <Typography variant="body1">
                    {asset.date ? new Date(asset.date).toLocaleDateString() : 'N/A'}
                  </Typography>
                </Grid>
                {asset.observations && (
                  <Grid size={{ xs: 12 }}>
                    <Typography variant="body2" color="text.secondary">Observations</Typography>
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
  const { data, isLoading, error, update } = useAssetsData();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });


  const handleUpdate = (asset: Asset) => {
    setSelectedAsset(asset);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedAsset(null);
  };

  const handleSaveUpdate = async (updatedAsset: Asset) => {
    try {
      await update(updatedAsset);

      setSnackbar({
        open: true,
        message: 'Equipment updated successfully',
        severity: 'success',
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: getErrorMessage(err),
        severity: 'error',
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };


  const handleChangePage = (_event: unknown, newPage: number) => {
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

  if (data.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: 6,
          bgcolor: 'background.paper',
          borderRadius: 1,
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No Equipment Found
        </Typography>
        <Typography variant="body2" color="text.secondary">
          There are no equipment records to display.
        </Typography>
      </Box>
    );
  }



  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650, tableLayout: 'fixed' }} aria-label="assets table">
          <TableHead>
            <TableRow>
              <StyledTableCell sx={{ width: '8%' }}/>
              <StyledTableCell sx={{ width: '10%' }}>Label ID </StyledTableCell>
              <StyledTableCell sx={{ width: '15%' }}>Component</StyledTableCell>
              <StyledTableCell sx={{ width: '35%' }}>Equipment</StyledTableCell>
              <StyledTableCell sx={{ width: '20%' }}>Sector</StyledTableCell>
              <StyledTableCell sx={{ width: '10%' }}>State</StyledTableCell>
              <StyledTableCell sx={{ width: '10%' }}>Actions</StyledTableCell>
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

    <EditDialog
      open={dialogOpen}
      asset={selectedAsset}
      onClose={handleCloseDialog}
      onSave={handleSaveUpdate}
    />

    <Snackbar
      open={snackbar.open}
      autoHideDuration={6000}
      onClose={handleCloseSnackbar}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert
        onClose={handleCloseSnackbar}
        severity={snackbar.severity}
        sx={{ width: '100%' }}
      >
        {snackbar.message}
      </Alert>
    </Snackbar>
    </>

  );
};

export default AssetsTable;

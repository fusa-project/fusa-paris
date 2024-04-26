import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
  
const VideoReportOutput = ({output}) => {

    return (
      <div>
        <h2>De acuerdo al video:</h2>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Clase</TableCell>
                <TableCell align="right">Contador</TableCell>
                <TableCell align="right">Velocidad Promedio</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {output.map((row) => (
                <TableRow
                  key={row.class_name}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.class_name}
                  </TableCell>
                  <TableCell align="right">{row.counter}</TableCell>
                  <TableCell align="right">{row.speed_average}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    );
  }

export default VideoReportOutput
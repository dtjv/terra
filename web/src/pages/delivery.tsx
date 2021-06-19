import { colHeaders, tableData } from "../data";
import { Schedule } from "components/schedule";

let grid = {
  numRows: tableData.length + 1,
  numCols: colHeaders.length,
  wCol: "100px",
  hRow: "50px",
  templateRows: "",
  templateCols: "",
};
const templateCols = `repeat(${grid.numCols}, minmax(${grid.wCol}, 1fr))`;
const templateRows = `repeat(${grid.numRows}, minmax(${grid.hRow}, 1fr))`;

grid = { ...grid, templateRows, templateCols };

const Delivery = () => {
  return <Schedule grid={grid} headers={colHeaders} table={tableData} />;
};

export default Delivery;

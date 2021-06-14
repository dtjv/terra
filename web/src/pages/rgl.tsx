import * as React from "react";
import RGL from "react-grid-layout";
import { Box } from "@chakra-ui/react";

class Grid extends React.PureComponent {
  static defaultProps = {
    //    compactType: "vertical",
    preventCollision: true,
  };

  render() {
    const layout = [
      { i: "a", x: 0, y: 0, w: 2, h: 2 },
      { i: "b", x: 0, y: 2, w: 2, h: 2 },
      { i: "c", x: 0, y: 4, w: 2, h: 2 },
      { i: "d", x: 2, y: 0, w: 2, h: 4 },
      { i: "e", x: 2, y: 8, w: 2, h: 2 },
      { i: "f", x: 4, y: 0, w: 2, h: 2 },
    ];

    const renderedItems = layout.map((item) => (
      <div key={item.i}>
        <Box
          style={{
            color: "black",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            backgroundColor: "papayawhip",
          }}
        >
          {item.i}
        </Box>
      </div>
    ));

    return (
      <Box bg="gray.50">
        <RGL
          layout={layout}
          cols={12}
          rowHeight={30}
          width={1200}
          onLayoutChange={(layout) => console.log(layout)}
          {...this.props}
        >
          {renderedItems}
        </RGL>
      </Box>
    );
  }
}

export default Grid;

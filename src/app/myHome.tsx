'use client'

import Image from "next/image";
import DeckGL from "@deck.gl/react/typed";
import {OrbitView, COORDINATE_SYSTEM
} from "@deck.gl/core/typed";
import { PointCloudLayer } from "@deck.gl/layers/typed";
import { styled } from "@mui/material/styles";
import React, { useState } from "react";

const PREFIX = "VolveWells";

const classes = {
  main: `${PREFIX}-main`,
};

const Root = styled("div")({
  [`& .${classes.main}`]: {
      width: 1000,
      height: 500,
      border: "1px solid black",
      position: "relative",
  },
});

const isSSR = () => typeof window === undefined; 

interface Data {
    position: [number, number, number],
    normal: [number, number, number],
    color: [number, number, number]
}

    const SAMPLE_SIZE = 1e3; //1e6;
    const SURFACE_EQUATION = (x: number, y: number) => Math.sin(x * x + y * y) * x / Math.PI;
    const EPSILON = 1e-4;

    // const points = [];
    const dim = Math.sqrt(SAMPLE_SIZE);

    function getPosition(u: number, v: number) {
      const x = (u - 1/2) * Math.PI * 2;
      const y = (v - 1/2) * Math.PI * 2;
      const z = Math.random(); //SURFACE_EQUATION(x, y);

      return [x, y, z];
    }

    function getNormal(u: number, v: number) {
      const p0 = getPosition(u - EPSILON, v - EPSILON);
      const p1 = getPosition(u + EPSILON, v + EPSILON);

      const nx = (p1[1] - p0[1]) * (p1[2] - p0[2]);
      const ny = (p1[2] - p0[2]) * (p1[0] - p0[0]);
      const nz = (p1[0] - p0[0]) * (p1[1] - p0[1]);

      return [nx, ny, nz];
    }

    function getPoints(): Data[] {
      console.log("getPoints CALLED")
      const points: Data[] = [];
      for (let i = 0; i < dim; i++) {
        for (let j = 0; j < dim; j++) {
          const u = i / (dim - 1);
          const v = j / (dim - 1);
        
          const p = getPosition(u, v);
          const n = getNormal(u, v);
          points.push({
            position: p as [number, number, number],
            normal: n as [number, number, number],
            color: [u *128, v *128, p[2] * 255]
          });
        }
      }
      return points;
  }


export default function MyHome() {
  console.log("MyHome component redraw")

  const [points, setPoints] = React.useState<Data[]>([]);

  function myOnClickFunction() {
    setPoints(getPoints());
    console.log("CLICK!");
  }


  return (
    <Root>
      <div className={classes.main}>
   
        {!isSSR() && <p> Rendering on client</p>}
        {isSSR() && <p> Rendering on server</p>}

        <DeckGL
          views={[new OrbitView()]}
          initialViewState= {{rotationX: 45, rotationOrbit: -45, zoom: 5}}
          controller= {true}
          layers= {[
                new PointCloudLayer({
                  id: 'pointCloud',
                  data: points,
                  getPosition: d => d.position,
                  getNormal: d => d.normal,
                  getColor: d => d.color,
                  pointSize: 1
                })
          ] }
        />
      </div>
      <button onClick={() => myOnClickFunction()} > Get Data </button>

      </Root>

  );
}




//import SubsurfaceViewer from "@webviz/subsurface-viewer";




// const myProps = {
//   id: "map",
//   layers: [{
//     "@@type": "NorthArrow3DLayer",
//     id: "north-arrow-layer",
//    },
//    {
//     "@@type": "AxesLayer",
//     id: "axes_small",
//     bounds: [459840.7, 5929826.1, 0, 460540.7, 5930576.1, 99],
//   }
//   ],
 

//   bounds: [459840.7, 5929826.1, 460540.7, 5930576.1] as [number, number, number, number],
//   views: {
//     layout: [1, 1] as [number, number],
//     viewports: [
//         {
//             id: "view_1",
//             show3D: true,
//         },
//     ],
// },
// };

// export default function MyHome() {
//   console.log("MyHome component")
//   return (

//       <div className="z-1 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
//          {!isSSR() && <SubsurfaceViewer {...myProps}></SubsurfaceViewer>} 
//       </div>

//   );
// }

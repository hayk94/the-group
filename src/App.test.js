import { render } from "@testing-library/react";
import React from "react";

import RootComponent from "./components/RootComponent";

test("renders learn react link", () => {
  const { getByText } = render(<RootComponent />);
  const linkElement = getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});

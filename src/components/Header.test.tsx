import { render, screen } from "@testing-library/react";
import Header from "../components/Header";

describe("Header", () => {
  it("renders the app title", () => {
    render(<Header />);
    const title = screen.getByRole("heading", {
      name: /gamer picker/i,
      level: 1,
    });
    expect(title).toBeInTheDocument();
  });
});

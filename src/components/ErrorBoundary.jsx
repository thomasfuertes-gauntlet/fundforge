import { Component } from "react";
import { Button } from "@/components/ui/button";

export default class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
          <h2 className="text-2xl font-bold text-foreground">
            Something went wrong
          </h2>
          <p className="mt-2 text-muted-foreground">
            We hit an unexpected error loading this page.
          </p>
          <Button
            className="mt-6"
            onClick={() => {
              this.setState({ hasError: false });
              window.location.href = "/";
            }}
          >
            Back to home
          </Button>
        </div>
      );
    }
    return this.props.children;
  }
}

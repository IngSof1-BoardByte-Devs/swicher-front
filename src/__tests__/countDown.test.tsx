import { render, screen, act } from "@testing-library/react";
import CountDown from "@components/countDown";
import { jest } from "@jest/globals";
import "@testing-library/jest-dom"; 

describe("CountDown", () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.runOnlyPendingTimers();
        jest.useRealTimers();
        jest.clearAllTimers();
        jest.clearAllMocks();
    });

    it("should render the initial time correctly", () => {
        render(<CountDown startTime={null} duration={120} onEnd={jest.fn()} />);
        expect(screen.getByText("2:00")).toBeInTheDocument(); // 120 seconds = 2 minutes
    });

    it("should start countdown when startTime is provided", () => {
        const startTime = Date.now() / 1000;
        render(<CountDown startTime={startTime} duration={120} onEnd={jest.fn()} />);

        // Fast-forward 1 second
        act(() => {
            jest.advanceTimersByTime(1000);
        });

        // Expect time to be updated to 1:59 (119 seconds)
        expect(screen.getByText("1:59")).toBeInTheDocument();
    });

    it("should call onEnd when time runs out", () => {
        const onEnd = jest.fn();
        const startTime = Date.now() / 1000;

        render(<CountDown startTime={startTime} duration={1} onEnd={onEnd} />);

        // Fast-forward until timer reaches zero
        act(() => {
            jest.advanceTimersByTime(1000); // advance by 1 second
        });

        expect(onEnd).toHaveBeenCalled();
        expect(screen.getByText("0:00")).toBeInTheDocument();
    });

    it("should clear interval on unmount", () => {
        const startTime = Date.now() / 1000;
        const clearIntervalSpy = jest.spyOn(global, "clearInterval");
        const { unmount } = render(<CountDown startTime={startTime} duration={120} onEnd={jest.fn()} />);
        

        unmount();

        expect(clearIntervalSpy).toHaveBeenCalled();
        clearIntervalSpy.mockRestore();
    });
});

import React from "react";

export function List({ info_list, children }: { info_list: string[], children?: React.ReactNode }) {
    return (
        <ul>
            {info_list.map((info: string, index: number) => {
                return <li key={index}>{children ? children : info}</li>;
            })}
        </ul>
    );
}

export default List;
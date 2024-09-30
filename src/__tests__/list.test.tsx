import React from 'react';
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import MyList from "../components/list";

describe('List Component', () => {
    test('renders list items from info_list', () => {
        const infoList = ['Item 1', 'Item 2', 'Item 3'];
        render(<MyList info_list={infoList} />);

        infoList.forEach(item => {
            expect(screen.getByText(item)).toBeInTheDocument();
        });
    });

    test('renders children instead of info_list items', () => {
        const infoList = ['Item 1', 'Item 2', 'Item 3'];
        const ChildComponent = ({ info }: { info: string }) => <span>{info}</span>;
        render(
            <MyList info_list={infoList}>
                <ChildComponent info="Child Item" />
            </MyList>
        );
        const childItems = screen.getAllByText('Child Item');
        expect(childItems).toHaveLength(infoList.length);
    });
});
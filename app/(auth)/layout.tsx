import React, {PropsWithChildren} from 'react';

type LayoutProps = PropsWithChildren<{}>;

const Layout = ({children}: LayoutProps) => {
    return (
        <div className={'bg-gray-100 h-full flex items-center justify-center'}>
            {children}
        </div>
    );
};

export default Layout;
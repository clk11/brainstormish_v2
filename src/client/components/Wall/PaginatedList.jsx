import React, { useState } from 'react';
import { Box, Pagination } from '@mui/material';

const PaginatedList = ({ data,page,setPage }) => {
    const itemsPerPage = 4;
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    const currentPageData = data.slice(startIndex, endIndex);

    return (
        <div>
            {currentPageData.map((post, index) => (
                <div key={index} style={{ marginBottom: '16px' }}>
                    {post}
                </div>
            ))}
            <Box mt={2} display="flex" justifyContent="center">
                <Pagination
                    count={Math.ceil(data.length / itemsPerPage)}
                    page={page}
                    onChange={handleChangePage}
                />
            </Box>
        </div>
    );
}

export default PaginatedList;

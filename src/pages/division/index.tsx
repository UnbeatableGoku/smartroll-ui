import { lazy } from 'react';

const DivisionCreationSuggesition = lazy(() => import('./pages/DivisionCreationSuggesition'))
const StudentListForDivision = lazy(() => import('./pages/StudentListForDivision'))

export {DivisionCreationSuggesition, StudentListForDivision}
import React, { createContext } from 'react'

type PropsContent = {
    snackBar: React.Dispatch<React.SetStateAction<Object>>;
}

const DEFAULT_VALUE = {
    snackBar: () => { },
}

const SnackContext = createContext<PropsContent>(DEFAULT_VALUE);

export default SnackContext;
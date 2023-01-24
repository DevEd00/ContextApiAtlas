
import { MainContext } from '../../context'
import { useContext, useEffect, useState } from 'react'


export const MyComponent = () => {

    const { state, setState } = useContext(MainContext)
    const [collapsed, setCollapsed] = useState<boolean>(false);
    const handleOnClick = () => {
        setCollapsed(collapsed => !collapsed)

    }
    useEffect(() => {
        console.log("Changed: ", state)
    }, [state])
    useEffect(() => {
        setState({
            ...state,
            collapsed
        })
    }, [collapsed])


    return (
        <div>
            <button onClick={handleOnClick}>
                Click
            </button>
            {'Hola mundo'}
        </div>)
}
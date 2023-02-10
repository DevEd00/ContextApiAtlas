import { MainContext } from "../../context/MainContext"
import { useContext, useEffect, useState } from "react"

export const MyComponent2 = () => {

    const [loading, setLoading] = useState<boolean>(true);
    const [initialized, setInitialized] = useState<boolean>(false)
    const [record, setRecord] = useState<any>({})
    const { getService, authenticate, user, setUser } = useContext(MainContext)

    const getData = async () => {
        try {
            console.log(localStorage.getItem("token"))
            const service = getService("empresa/select/all")
            setLoading(true);
            let resp = await service.get(14)
            setRecord(resp)
            setLoading(false)
            setInitialized(true);
            console.log('response:_', resp)
        } catch (error) {
            setLoading(false)
            console.log(error)
        }
    }
    const signIn = async () => {
        try {
            const user = await authenticate({
                "identificadorNegocio": 14,
                "pass": "equipodevitech2022",
                "user": "EDESARROLLO"
            });
            if (user)
                setUser(user);

        } catch (error) {
            setLoading(false)
            console.log(error)
        }

    }
    useEffect(() => {
        signIn();

    }, [])
    useEffect(() => {

        if (user && !initialized) getData();

    }, [user])

    if (loading) return (<span>"Loading..."</span>)

    return (
        <>

            {JSON.stringify(record)}

        </>
    )
}

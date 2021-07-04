import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import "./index.css"

interface IJoke {
    id: number,
    setup: string,
    punchline: string,
    color: string
}

function Jokes() {
    const [jokes, setJokes] = useState<IJoke[]>([])

    useEffect(() => {
        async function getJokes() {
            const response = await fetch("https://official-joke-api.appspot.com/random_ten")
            const jokes = await response.json()
            const colors = ["green", "red", "blue", "black", "yellow"]
            const filteredJokes = jokes.slice(0, 5).map((joke: IJoke, idx: number) => {
                const { id, setup, punchline } = joke
                return {
                    id,
                    setup,
                    punchline,
                    color: colors[idx]
                }
            })
            setJokes(filteredJokes)
        }
        getJokes()

    }, [])

    function getMid(component) {
        return (component.parentElement.offsetWidth - component.offsetWidth) / 2
    }

    function rotate(mid, left) {
        let rotate = (left - mid) / 10
        if (rotate < 0) {
            rotate = rotate > -45 ? rotate : -45
        }
        else {
            rotate = rotate < 45 ? rotate : 45
        }
        return rotate
    }

    function isNext(component) {
        const mid = getMid(component)
        return Math.abs(component.offsetLeft - mid) > component.offsetWidth
    }

    function mouseDownHandler(event: React.MouseEvent<HTMLElement, MouseEvent>) {
        const element = document.getElementById("active-drag")
        element.classList.remove("noTransition")
        document.querySelectorAll(".draggable").forEach((obj: HTMLElement, idx) => {
            if (obj.id !== "active-drag") {
                if (idx % 2 === 0) {
                    obj.style.transform = `rotate(-${(idx + 1) * 2.5}deg)`
                }
                else {
                    obj.style.transform = `rotate(${(idx + 1) * 2.5}deg)`
                }
            }
        })
        document.addEventListener("mouseup", mouseUpHandler)
        document.addEventListener("mousemove", mouseDragHandler)
    }

    function mouseDragHandler(event: MouseEvent) {
        const element = document.getElementById("active-drag")
        const left = event.clientX - (element.offsetWidth / 2)
        const mid = getMid(element)
        element.style.left = `${left}px`;
        element.style.transform = `rotate(${rotate(mid, left)}deg)`
    }

    function mouseUpHandler(event: MouseEvent) {
        const element = document.getElementById("active-drag")
        const mid = getMid(element)
        document.querySelectorAll(".draggable").forEach((obj: HTMLElement) => {
            obj.style.transform = "rotate(0)"
            if (isNext(element)) {
                element.style.transform = "scale(.8)"
                if (obj.id === "active-drag") {
                    obj.style.zIndex = "0"
                }
                setTimeout(() => {
                    const [lastJoke] = jokes.slice(-1)
                    setJokes([lastJoke, ...jokes.slice(0, jokes.length - 1)])
                    element.classList.add("noTransition")
                    element.style.transform = "scale(1)"
                    element.style.zIndex = jokes.length.toString()
                }, 250)
            }
        })
        element.style.left = mid + "px"
        document.removeEventListener("mouseup", mouseUpHandler)
        document.removeEventListener("mousemove", mouseDragHandler)
    }

    return (
        <main className="container" >
            {jokes.map((joke, idx) => (
                <div key={`joke-${idx}`}
                    className="draggable"
                    onMouseDown={mouseDownHandler}
                    id={idx === jokes.length - 1 ? "active-drag" : ""}>
                    <span className={joke.color}>
                        <p>{joke.setup}</p>
                        <p>{joke.punchline}</p>
                    </span>
                </div>
            ))}
        </main >
    )
}

ReactDOM.render(
    <Jokes />, document.getElementById("root")
)
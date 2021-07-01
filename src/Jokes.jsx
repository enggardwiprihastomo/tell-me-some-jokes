import React, { useEffect, useRef, useState } from "react";

function Jokes() {
    const [jokes, setJokes] = useState([])

    const refDrag = useRef(null)

    useEffect(() => {
        (async function () {
            const response = await fetch("https://official-joke-api.appspot.com/random_ten")
            const jokes = await response.json()
            const colors = ["green", "red", "blue", "gray", "yellow"]
            const filteredJokes = jokes.slice(0, 5).filter((joke, idx) => {
                const { id, setup, punchline } = joke
                return {
                    id,
                    setup,
                    punchline,
                    color: colors[idx]
                }
            })
            console.log(response)
            setJokes(filteredJokes)
        })()

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
        return Math.abs(component.offsetLeft - mid) > component.offsetWidth + 30
    }

    function mouseDownHandler(event) {
        document.querySelectorAll(".draggable").forEach((obj, idx) => {
            if (obj.id !== "active-drag") {
                if (idx % 2 === 0) {
                    obj.style.transform = `rotate(-${(idx + 1) * 2.5}deg)`
                }
                else {
                    obj.style.transform = `rotate(${(idx + 1) * 2.5}deg)`
                }
            }
            obj.style.zIndex = idx + 1
        })
        document.onmouseup = mouseUpHandler
        document.onmousemove = mouseDragHandler
    }

    function mouseDragHandler(event) {
        const left = event.clientX - (refDrag.current.offsetWidth / 2)
        const mid = getMid(refDrag.current)
        refDrag.current.style.left = `${left}px`;
        refDrag.current.style.transform = `rotate(${rotate(mid, left)}deg)`
    }

    function mouseUpHandler() {
        const mid = getMid(refDrag.current)
        document.querySelectorAll(".draggable").forEach((obj, idx) => {
            obj.style.transform = "rotate(0)"
            if (isNext(refDrag.current)) {
                if (obj.id === "active-drag") {
                    obj.style.zIndex = 0
                }
                setTimeout(() => {
                    const [lastJoke] = jokes.slice(-1)
                    setJokes([lastJoke, ...jokes.slice(0, jokes.length - 1)])
                }, 200)
            }
        })
        refDrag.current.style.left = mid + "px"
        document.onmouseup = null;
        document.onmousemove = null;
    }

    return (
        <main className="container" >
            {jokes.map((joke, idx) => (
                <div key={`joke-${idx}`}
                    ref={idx === jokes.length - 1 ? refDrag : null}
                    className="draggable"
                    onMouseDown={mouseDownHandler}
                    id={idx === jokes.length - 1 ? "active-drag" : null}>
                    <span className={joke.color}>
                        <p>{joke.setup}</p>
                        <p>{joke.punchline}</p>
                    </span>
                </div>
            ))}
        </main >
    )
}

export default Jokes
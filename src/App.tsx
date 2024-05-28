import { useEffect, useState } from "react"
import style from "./style.module.scss"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import { IPhoto } from "./types/types"
import { Cross } from "./icons/Cross"
import { Camera } from "./icons/Camera"

const App = () => {
  // const [photos, setPhotos] = useState<IPhoto[]>([
  //   {
  //     name: "empty",
  //     url: "",
  //   },
  //   {
  //     name: "empty",
  //     url: "",
  //   },
  //   {
  //     name: "empty",
  //     url: "",
  //   },
  //   {
  //     name: "empty",
  //     url: "",
  //   },
  //   {
  //     name: "empty",
  //     url: "",
  //   },
  //   {
  //     name: "empty",
  //     url: "",
  //   },
  //   {
  //     name: "empty",
  //     url: "",
  //   },
  // ])

  const [photos, setPhotos] = useState<IPhoto[]>([])

  const handleDelete = (_: React.MouseEvent, name: string) => {
    setPhotos((prew) => {
      return prew.filter((image) => image.name !== name)
    })
  }

  const handleChange = (files: FileList | null) => {
    if (files) {
      const fileList = [...Object.values(files)]

      fileList.forEach((file: File) => {
        setPhotos((prew) => {
          return [
            ...prew,
            {
              name: file.name,
              url: URL.createObjectURL(file),
            },
          ]
        })
      })

      // fileList.forEach((file: any, index: number) => {
      //   setPhotos((prew) => {
      //     const list = [...prew]

      //     const photo: IPhoto = {
      //       id: (index + 1).toString(),
      //       name: file.name,
      //       url: URL.createObjectURL(file),
      //     }

      //     list.splice(index, 1, photo)

      //     return list
      //   })
      // })
    } else {
      console.error("files === null")
    }
  }

  const onDragEnd = (result: any) => {
    if (!result.destination) return

    setPhotos((prew) => {
      const list = [...prew]
      const [removed] = list.splice(result.source.index, 1)
      list.splice(result.destination.index, 0, removed)
      return list
    })
  }

  useEffect(() => {
    console.log(photos)
  }, [photos])

  return (
    <div className={style.container}>
      <div className={style.photoInputWrapper}>
        <label htmlFor="photoInput">
          <Camera />
        </label>
        <input
          id="photoInput"
          type="file"
          accept=".png, .jpg, .jpeg"
          onChange={(e) => {
            handleChange(e.target.files)
          }}
          multiple
        />
      </div>
      <DragDropContext onDragEnd={(result) => onDragEnd(result)}>
        <div className={style.gridContainer}>
          {photos.map((item: IPhoto, index: number) => {
            return (
              <Droppable droppableId={index.toString()} key={index}>
                {(provided, snapshot) => {
                  console.log(snapshot)

                  return (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      style={{
                        background: snapshot.isDraggingOver ? "lightblue" : "lightgrey",
                      }}
                    >
                      {provided.placeholder}
                      <Draggable draggableId={index.toString()} index={index}>
                        {(provided, snapshot) => {
                          return (
                            <div
                              key={index}
                              draggable={true}
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={{
                                userSelect: "none",
                                backgroundColor: snapshot.isDragging ? "#263B4A" : "#456C86",
                                ...provided.draggableProps.style,
                              }}
                              className={style.imageWrapper}
                            >
                              <img src={item.url} alt={item.name} className={style.image} />
                              <button
                                className={style.button}
                                onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) =>
                                  handleDelete(e, item.name)
                                }
                              >
                                <Cross />
                              </button>
                            </div>
                          )
                        }}
                      </Draggable>
                    </div>
                  )
                }}
              </Droppable>
            )
          })}
        </div>
      </DragDropContext>
    </div>
  )
}

export default App

export class Todo {
  id: number = 0
  content: string = ""
  done: boolean = false
  date: string = ""

  constructor(content: string, done: boolean) {
    this.id = Math.floor(Math.random() * 1000)
    this.content = content
    this.done = done
    this.date = new Date().toString()
  }
}

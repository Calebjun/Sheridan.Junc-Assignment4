package sheridan.junc.librarydata.controller;

import sheridan.junc.librarydata.data.Book;
import sheridan.junc.librarydata.data.BookRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.Parameters;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import java.util.List;

@Slf4j
@RestController
@RequestMapping(value = "/api/books", produces = "application/json")
@Tag(name = "Books", description = "Endpoints for managing books")
public class BooksController {

    private final BookRepository bookRepository;

    public BooksController(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    @GetMapping(produces = "application/json")
    @Operation(summary = "Retrieve all books", description = "Returns a list of all books")
    public List<Book> getAllBooks() {
        log.trace("getAllBooks() is called");
        return bookRepository.findAll();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Retrieve a book by ID", description = "Returns a book with the specified ID")
    @Parameters(
            @Parameter(name = "id", description = "The ID of the book to retrieve", required = true, example = "BK-01")
    )
    public ResponseEntity<Book> getBookById(@PathVariable String id) throws NoResourceFoundException {
        log.trace("getBookById() is called with id={}", id);
        return bookRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new NoResourceFoundException(HttpMethod.GET, null, "/api/books/" + id));
    }

    @PostMapping(consumes = "application/json")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Add a new book", description = "Creates a new book entry")
    public Book addBook(@Valid @RequestBody Book book) {
        log.trace("addBook() is called with book={}", book);
        if (bookRepository.existsById(book.getItemId())) {
            throw new IllegalArgumentException("Book with ID " + book.getItemId() + " already exists");
        }
        return bookRepository.save(book);
    }

    @PutMapping(value = "/{id}", consumes = "application/json")
    @Operation(summary = "Update an existing book", description = "Updates a book with the specified ID")
    @Parameters(
            @Parameter(name = "id", description = "The ID of the book to update", required = true, example = "BK-01")
    )
    public ResponseEntity<Book> updateBook(@PathVariable String id, @Valid @RequestBody Book book) throws NoResourceFoundException {
        log.trace("updateBook() is called with id={}, book={}", id, book);
        if (!bookRepository.existsById(id)) {
            throw new NoResourceFoundException(HttpMethod.PUT, null, "/api/books/" + id);
        }
        book.setItemId(id);
        return ResponseEntity.ok(bookRepository.save(book));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Delete a book", description = "Deletes a book with the specified ID")
    @Parameters(
            @Parameter(name = "id", description = "The ID of the book to delete", required = true, example = "BK-01")
    )
    public void deleteBook(@PathVariable String id) throws NoResourceFoundException {
        log.trace("deleteBook() is called with id={}", id);
        if (!bookRepository.existsById(id)) {
            throw new NoResourceFoundException(HttpMethod.DELETE, null, "/api/books/" + id);
        }
        bookRepository.deleteById(id);
    }
}

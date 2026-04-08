package sheridan.junc.librarydata.data;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.validation.constraints.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Book {
    @Id
    @NotBlank(message = "Item ID is required")
    private String itemId;

    @NotBlank(message = "ISBN is required")
    private String isbn;

    @NotBlank(message = "Book title is required")
    @Size(min = 1, max = 255, message = "Book title must be between 1 and 255 characters")
    private String bookTitle;

    @Min(value = 1, message = "Page count must be at least 1")
    private int pageCount;

    private boolean isAvailable;

    @Min(value = 0, message = "Late fee cannot be negative")
    private double lateFeeUsd;
}

package sheridan.junc.librarydata.data;

import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;
import tools.jackson.databind.ObjectMapper;

import java.io.InputStream;

@Slf4j
@Component
public class DatabaseInitializer {

    @Value("classpath:data/library.json")
    private Resource resourceFile;

    private final BookRepository bookRepository;
    private final ObjectMapper objectMapper;


    public DatabaseInitializer(
            BookRepository bookRepository,
            ObjectMapper objectMapper
    ) {
        this.bookRepository = bookRepository;
        this.objectMapper = objectMapper;
    }

    @PostConstruct
    public void init() {
        if (bookRepository.count() == 0) {
            try {
                InputStream inputStream = resourceFile.getInputStream();
                LibraryData libraryData = objectMapper.readValue(inputStream, LibraryData.class);
                bookRepository.saveAll(libraryData.getBooks());
            } catch (java.io.IOException e) {
                throw new RuntimeException("Failed to initialize database from JSON file", e);
            }
            log.info("Database initialized with {} books", bookRepository.count());
        }
    }

}

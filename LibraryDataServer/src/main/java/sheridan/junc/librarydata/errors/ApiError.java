package sheridan.junc.librarydata.errors;

public record ApiError(
        int status,
        String error,
        String message
){}

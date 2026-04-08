package sheridan.junc.librarydata.config;

import sheridan.junc.librarydata.filter.RequestLogFilter;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FilterConfig {

    @Bean
    public FilterRegistrationBean<RequestLogFilter> loggingFilter() {
        FilterRegistrationBean<RequestLogFilter> registrationBean = new FilterRegistrationBean<>();

        registrationBean.setFilter(new RequestLogFilter());
        // Specify the URL patterns
        registrationBean.addUrlPatterns("/api/*");
        // Set the order if you have multiple filters
        registrationBean.setOrder(1);

        return registrationBean;
    }
}

package eu.wisercat.testtask.repo;

import eu.wisercat.testtask.models.Article;
import org.springframework.data.repository.CrudRepository;

public interface ArticleRepository extends CrudRepository<Article, Long> {

}

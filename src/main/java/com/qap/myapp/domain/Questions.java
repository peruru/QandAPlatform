package com.qap.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Questions.
 */
@Entity
@Table(name = "questions")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Questions implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "text")
    private String text;

    @OneToMany(mappedBy = "questions")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "answerLikes", "questions" }, allowSetters = true)
    private Set<Answers> answers = new HashSet<>();

    @ManyToMany
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JoinTable(
        name = "rel_questions__company",
        joinColumns = @JoinColumn(name = "questions_id"),
        inverseJoinColumns = @JoinColumn(name = "company_id")
    )
    @JsonIgnoreProperties(value = { "questions" }, allowSetters = true)
    private Set<Company> companies = new HashSet<>();

    @ManyToMany
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JoinTable(
        name = "rel_questions__tags",
        joinColumns = @JoinColumn(name = "questions_id"),
        inverseJoinColumns = @JoinColumn(name = "tags_id")
    )
    @JsonIgnoreProperties(value = { "questions" }, allowSetters = true)
    private Set<Tags> tags = new HashSet<>();

    @JsonIgnoreProperties(value = { "questions", "users" }, allowSetters = true)
    @OneToOne(mappedBy = "questions")
    private QuestionLikes questionLikes;

    @ManyToOne
    @JsonIgnoreProperties(value = { "questions", "questionLikes", "answerLikes" }, allowSetters = true)
    private Users users;

    @ManyToOne
    @JsonIgnoreProperties(value = { "questions", "topic" }, allowSetters = true)
    private SubTopic subTopic;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Questions id(Long id) {
        this.id = id;
        return this;
    }

    public String getText() {
        return this.text;
    }

    public Questions text(String text) {
        this.text = text;
        return this;
    }

    public void setText(String text) {
        this.text = text;
    }

    public Set<Answers> getAnswers() {
        return this.answers;
    }

    public Questions answers(Set<Answers> answers) {
        this.setAnswers(answers);
        return this;
    }

    public Questions addAnswers(Answers answers) {
        this.answers.add(answers);
        answers.setQuestions(this);
        return this;
    }

    public Questions removeAnswers(Answers answers) {
        this.answers.remove(answers);
        answers.setQuestions(null);
        return this;
    }

    public void setAnswers(Set<Answers> answers) {
        if (this.answers != null) {
            this.answers.forEach(i -> i.setQuestions(null));
        }
        if (answers != null) {
            answers.forEach(i -> i.setQuestions(this));
        }
        this.answers = answers;
    }

    public Set<Company> getCompanies() {
        return this.companies;
    }

    public Questions companies(Set<Company> companies) {
        this.setCompanies(companies);
        return this;
    }

    public Questions addCompany(Company company) {
        this.companies.add(company);
        company.getQuestions().add(this);
        return this;
    }

    public Questions removeCompany(Company company) {
        this.companies.remove(company);
        company.getQuestions().remove(this);
        return this;
    }

    public void setCompanies(Set<Company> companies) {
        this.companies = companies;
    }

    public Set<Tags> getTags() {
        return this.tags;
    }

    public Questions tags(Set<Tags> tags) {
        this.setTags(tags);
        return this;
    }

    public Questions addTags(Tags tags) {
        this.tags.add(tags);
        tags.getQuestions().add(this);
        return this;
    }

    public Questions removeTags(Tags tags) {
        this.tags.remove(tags);
        tags.getQuestions().remove(this);
        return this;
    }

    public void setTags(Set<Tags> tags) {
        this.tags = tags;
    }

    public QuestionLikes getQuestionLikes() {
        return this.questionLikes;
    }

    public Questions questionLikes(QuestionLikes questionLikes) {
        this.setQuestionLikes(questionLikes);
        return this;
    }

    public void setQuestionLikes(QuestionLikes questionLikes) {
        if (this.questionLikes != null) {
            this.questionLikes.setQuestions(null);
        }
        if (questionLikes != null) {
            questionLikes.setQuestions(this);
        }
        this.questionLikes = questionLikes;
    }

    public Users getUsers() {
        return this.users;
    }

    public Questions users(Users users) {
        this.setUsers(users);
        return this;
    }

    public void setUsers(Users users) {
        this.users = users;
    }

    public SubTopic getSubTopic() {
        return this.subTopic;
    }

    public Questions subTopic(SubTopic subTopic) {
        this.setSubTopic(subTopic);
        return this;
    }

    public void setSubTopic(SubTopic subTopic) {
        this.subTopic = subTopic;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Questions)) {
            return false;
        }
        return id != null && id.equals(((Questions) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Questions{" +
            "id=" + getId() +
            ", text='" + getText() + "'" +
            "}";
    }
}
